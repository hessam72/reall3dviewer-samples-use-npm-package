import withTM from 'next-transpile-modules';
export default withTM(['@reall3d/reall3dviewer', '@gotoeasy/three-tile'])({
    webpack(config) {
        // 🧹 1) Remove the global asset generator to prevent Next.js merging filename into inline assets
        if (config.module.generator && config.module.generator.asset) {
            config.module.generator['asset/resource'] = config.module.generator.asset;
            config.module.generator['asset/source'] = config.module.generator.asset;
            delete config.module.generator.asset;
        }

        // 2) Force your .wasm and .ply into asset/resource (valid for filename)
        config.module.rules.unshift(
            {
                test: /\.(ply|spx)$/,
                type: 'asset/resource',
                generator: { filename: 'static/models/[name][ext]' },
            },
            {
                test: /\.wasm$/,
                type: 'asset/resource',
                generator: { filename: 'static/wasm/[name][ext]' },
            },
        );

        // 3) Stub out Node modules
        config.resolve.fallback = {
            ...(config.resolve.fallback || {}),
            fs: false,
            path: false,
        };

        return config;
    },
});
