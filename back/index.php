<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

require_once 'vendor/autoload.php';
require_once './utils/database.php';
require_once './utils/token.php';
require_once './models/user.php';
require_once './models/block.php';
require_once './models/script.php';

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Psr7\Response as ResponseClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use Slim\Routing\RouteContext;

$dataBase = new DataBase();
$token = new Token();
$block = new Block($dataBase);
$script = new Script($dataBase);
$app = AppFactory::create();
$app->setBasePath(rtrim($_SERVER['PHP_SELF'], '/index.php'));

// Add error middleware
$app->addErrorMiddleware(true, true, true);
// Add routess
$app->post('/login', function (Request $request, Response $response) use ($dataBase) {

    $user = new User($dataBase);
    $requestData = $request->getParsedBody();
    try {
        $response->getBody()->write(json_encode($user->login($requestData['login'], $requestData['password'])));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "Пользователь не найден")));
        return $response->withStatus(401);
    }
});

$app->post('/sign-up', function (Request $request, Response $response) use ($dataBase) {
    $user = new User($dataBase);
    try {
        $response->getBody()->write(json_encode($user->create((object) $request->getParsedBody())));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "Пользователь уже существует")));
        return $response->withStatus(401);
    }
});

$app->post('/refresh-token', function (Request $request, Response $response) use ($dataBase) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->refreshToken($request->getParsedBody()['token'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("error" => $e, "message" => $e->getMessage())));
        return $response->withStatus(401);
    }
});

$app->post('/delete-token', function (Request $request, Response $response) use ($dataBase, $token) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->removeRefreshToken($token->decode($request->getParsedBody()['token'], true)->data->id)));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(401);
    }
});

$app->post('/update-password', function (Request $request, Response $response) use ($dataBase) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->getUpdateLink($request->getParsedBody()['email'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(500);
    }
});

$app->group('/', function (RouteCollectorProxy $group) use ($dataBase, $block, $script) {
    $group->get('folders', function (Request $request, Response $response) use ($script) {
        $userId = $request->getAttribute('userId');
        $response->getBody()->write(json_encode($script->getFolders($userId)));
        return $response;
    });
    $group->group('scripts',  function (RouteCollectorProxy $scriptGroup) use ($script) {
        $scriptGroup->get('', function (Request $request, Response $response) use ($script) {
            $query = $request->getQueryParams();
            $userId = $request->getAttribute('userId');
            $response->getBody()->write(json_encode($script->getFolder($userId, null, isset($query['searchString']) ? $query['searchString'] : '')));
            return $response;
        });

        $scriptGroup->get('/{folderId}', function (Request $request, Response $response) use ($script) {
            $routeContext = RouteContext::fromRequest($request);
            $route = $routeContext->getRoute();
            $folderId = $route->getArgument('folderId');
            $query = $request->getQueryParams();
            $userId = $request->getAttribute('userId');
            $response->getBody()->write(json_encode($script->getFolder($userId, $folderId, isset($query['searchString']) ? $query['searchString'] : '')));
            return $response;
        });
    });


    $group->group('script',  function (RouteCollectorProxy $scriptGroup) use ($script, $block) {
        $scriptGroup->post('', function (Request $request, Response $response) use ($script) {
            $response->getBody()->write(json_encode($script->create($request->getParsedBody())));
            return $response;
        });

        $scriptGroup->get('/{scriptId}', function (Request $request, Response $response) use ($script, $block) {
            $routeContext = RouteContext::fromRequest($request);
            $route = $routeContext->getRoute();
            $scriptId = $route->getArgument('scriptId');
            $userId = $request->getAttribute('userId');
            $response->getBody()->write(json_encode($script->read($userId, $scriptId, $block)));
            return $response;
        });

        $scriptGroup->get('/{scriptId}/blocks', function (Request $request, Response $response) use ($script) {
            $routeContext = RouteContext::fromRequest($request);
            $route = $routeContext->getRoute();
            $scriptId = $route->getArgument('scriptId');
            $response->getBody()->write(json_encode($script->getBlocks($scriptId)));
            return $response;
        });

        $scriptGroup->put('/{scriptId}/reorder-blocks', function (Request $request, Response $response) use ($script) {
            $response->getBody()->write(json_encode($script->sortBlocks($request->getParsedBody()['blocks'])));
            return $response;
        });
    });

    $group->group('block',  function (RouteCollectorProxy $scriptGroup) use ($block) {

        $scriptGroup->delete('/{blockId}', function (Request $request, Response $response) use ($block) {
            $routeContext = RouteContext::fromRequest($request);
            $route = $routeContext->getRoute();
            $blockId = $route->getArgument('blockId');
            $response->getBody()->write(json_encode($block->delete($blockId)));
            return $response;
        });

        $scriptGroup->put('/{blockId}/mark', function (Request $request, Response $response) use ($block) {
            $routeContext = RouteContext::fromRequest($request);
            $route = $routeContext->getRoute();
            $blockId = $route->getArgument('blockId');
            $response->getBody()->write(json_encode($block->markBlock($blockId, $request->getParsedBody())));
            return $response;
        });

        $scriptGroup->post('/{blockId}/transition', function (Request $request, Response $response) use ($block) {
            $routeContext = RouteContext::fromRequest($request);
            $route = $routeContext->getRoute();
            $blockId = $route->getArgument('blockId');
            $response->getBody()->write(json_encode($block->createTransition($blockId, $request->getParsedBody())));
            return $response;
        });

        $scriptGroup->post('', function (Request $request, Response $response) use ($block) {
            $response->getBody()->write(json_encode($block->create($request->getParsedBody())));
            return $response;
        });
    });

    $group->group('user',  function (RouteCollectorProxy $userGroup) use ($dataBase) {

        $userGroup->get('', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->read($userId)));
            return $response;
        });
    });

    $group->group('admin', function (RouteCollectorProxy $adminGroup) use ($dataBase) {
    })->add(function (Request $request, RequestHandler $handler) use ($dataBase) {
        $userId = $request->getAttribute('userId');

        $user = new User($dataBase);

        if ($user->checkAdmin($userId)) {
            return $handler->handle($request);
        }

        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => "Отказано в доступе к функционалу администратора")));
        return $response->withStatus(403);
    });
})->add(function (Request $request, RequestHandler $handler) use ($token) {
    try {
        $jwt = explode(' ', $request->getHeader('Authorization')[0])[1];
        $userId = $token->decode($jwt)->data->id;
        $request = $request->withAttribute('userId', $userId);
        $response = $handler->handle($request);

        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        echo json_encode($e);
        $response->getBody()->write(json_encode($e));
        if ($e->getCode() && $e->getCode() != 0) {
            return $response->withStatus($e->getCode());
        }
        return $response->withStatus(500);
    }
});

$app->run();
