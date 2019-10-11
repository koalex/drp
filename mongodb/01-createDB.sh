SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH

DB_PATH="./db"
DB_REPL_SET_NAME="drp_rs"
LOGS_PATH="./logs"

configRS="{
	_id: 'drp_rs',
	members: [
		{
			_id: 0,
			host: '127.0.0.1:27017',
			priority: 2,
			votes: 1,
			hidden: false
		},
		{
			_id: 1,
			host: '127.0.0.1:29017',
			priority: 1,
			votes: 1,
			hidden: false
		},
		{
			_id: 2,
			host: '127.0.0.1:31017',
			priority: 0,
			votes: 0,
			hidden: true
		}
	]
}"

if [[ ! -d "$LOGS_PATH" ]]
then
    mkdir "$LOGS_PATH"
fi

if [[ ! -d "$DB_PATH" ]]
then
    mkdir "$DB_PATH"
fi

if [[ ! -d "$DB_PATH"/rs0 ]]
then
    mkdir "$DB_PATH"/rs0
fi

if [[ ! -d "$DB_PATH"/rs1 ]]
then
    mkdir "$DB_PATH"/rs1
fi

if [[ ! -d "$DB_PATH"/rsh ]]
then
    mkdir "$DB_PATH"/rsh
fi

mongod --replSet $DB_REPL_SET_NAME --fork --logpath "logs/mongodb_rs0.log" --logappend --dbpath "$DB_PATH"/rs0 --port 27017 &&
mongod --replSet $DB_REPL_SET_NAME --fork --logpath "logs/mongodb_rs1.log" --logappend --dbpath "$DB_PATH"/rs1 --port 29017 &&
mongod --replSet $DB_REPL_SET_NAME --fork --logpath "logs/mongodb_rsh.log" --logappend --dbpath "$DB_PATH"/rsh --port 31017 &&

mongo --host localhost:27017,localhost:29017,localhost:31017 --eval "rs.initiate($configRS)" &&
mongo --host localhost:27017,localhost:29017,localhost:31017 --eval "db.getMongo().setReadPref('primaryPreferred')" &&
pkill -f mongo


