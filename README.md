<h1 align="center">Web application that allows its users to find solutions to PC problems.</h1>

<p align="center">
  <img width="467" height="586" src="https://logos-download.com/wp-content/uploads/2019/07/DriverPack_Solution_Logo-700x854.png">
</p>

## Development

* Before startup th application you need to start MongoDB (scripts example you can see in `mongodb/01-createDB.sh` & `mongodb/02-startDB.sh`)
* Create `.env` file and put it in to the root of repository (example in [.env.example](https://github.com/koalex/drp/blob/master/.env.example))

1. Install dependencies:
  ```bash
  npm install
  ```

2. Bootstrap the packages in the current Lerna repo:
  ```bash
  npm run bootstrap
  ```

3. Start backend:
  ```bash
  npm run dev:backend
  ```
4. Start webpack-dev-server:
  ```bash
  npm run dev:frontend
  ```


## Build front-end
If you want to build in specific directory then you'll need to set `WEBPACK_OUTPUT` variable in `.env` file. By default
the output directory is `client/react-front/dist`
  ```bash
	npm run build:frontend
  ```

