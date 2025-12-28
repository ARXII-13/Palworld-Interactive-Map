# Palworld-Interactive-Map - Data Mining

## Setup

Required using [FModel](https://fmodel.app/) to unpack the game file and export the below dir into the json:

- `Pal/Content/L10N`
- `Pal/Content/Pal/Maps`

For instruction on how to use FModel, checkout [Palworld-FModel](https://github.com/elliotks/Palworld-FModel).

Example of the `.env`:

```
DATA_DIR=C:\Users\wzq95\Downloads\FModel\Output\Exports\Pal
OUTPUT_DIR=.\output
LANGUAGE=en
```

## The script

### Local / Web Development

1. Run the script to generate the `pal-data-mining\output\mapObjects.json`.

    ```bash
    node src/index.js
    ```

2. Place the newly generated `mapObjects.json` under `pal-map\backend\src\assets\` for backend app to consume.
