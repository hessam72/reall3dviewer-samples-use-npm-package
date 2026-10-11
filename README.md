# npm package `@reall3d/reall3dviewer`

<p align=center>
	<a href="https://reall3d.com/reall3dviewer/samples-use-npm-package/index.html">
		<img src="https://gotoeasy.github.io/reall3d/reall3dviewer-samples-use-npm-package.png"/>
	</a>
</p>

# reall3dviewer-samples-use-npm-package

```shell
# install
npm i

# develop
npm run dev

# build
npm run build
```

# Car data

Car pages live at `/<gallery>/<carId>` (e.g. `/gallery/1`). By default the 3D file and specs for each car
are read from `public/data/cars.json`, keyed by car id, so no backend is needed:

```json
{
    "cars": {
        "1": {
            "fileUrl": "/last-car-scene.splat",
            "carDetails": { "model": "...", "build_year": "1401", "mileage": "45,000", "color": "...",
                            "document_status": "single_page", "price": "1250000000", "description": "..." },
            "bodyStats": [{ "bodyPart": "کاپوت", "status": "intact" }]
        }
    }
}
```

- `fileUrl` is a path under `public/` or a full URL.
- `document_status`: `single_page` | `multi_page` | `active_plate`
- `bodyStats[].status`: `paint` | `partial_paint` | `replaced` | `spray_paint` | `intact`

To go back to the backend API, set `NEXT_PUBLIC_DATA_SOURCE=api` in `.env` and rebuild.

# Links

- https://github.com/reall3d-com/Reall3dViewer
- https://github.com/gotoeasy/gsbox
