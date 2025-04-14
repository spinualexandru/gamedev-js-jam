import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    resolve: {
        alias: {
            '@': '/src',
            "@Engine": '/src/engine',
            "@Game": '/src/game',
            "@Assets": '/public/assets',
            "@Libs": '/src/libs',
            "@Scenes": '/src/scenes',
            "@Constants": '/src/constants',
            "@Types": '/src/types',
        }
    },
    server: {
        port: 8080
    }
});
