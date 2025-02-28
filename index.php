<?php
use App\Service;

require 'AutoLoader.php';

define('APP_VERSION', '1.4.6');

(new Service())->start();