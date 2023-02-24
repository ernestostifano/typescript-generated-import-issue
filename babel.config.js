module.exports = function (api) {
    api.cache.never();

    return {
        sourceMaps: true,
        sourceType: 'module',
        presets: [
            [
                '@babel/preset-env',
                {
                    spec: true,
                    modules: false,
                }
            ]
        ],
        overrides: [
            {
                test: ['**/*.ts'],
                presets: ['@babel/preset-typescript']
            }
        ]
    };
};
