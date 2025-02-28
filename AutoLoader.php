<?php
/**
 * AutoLoader class
 * @author Harshal Khairnar
 * Simple autoloader, so we don't need Composer just for this.
 **/

class AutoLoader {
    private static $basePath = __DIR__;
    public static function register() {
        spl_autoload_register(function ($class) {
            $file = self::$basePath.DIRECTORY_SEPARATOR.str_replace('\\', DIRECTORY_SEPARATOR, $class).'.php';
            if (file_exists($file)) {
                require $file;
                return true;
            }
            return false;
        });
    }
}
AutoLoader::register();