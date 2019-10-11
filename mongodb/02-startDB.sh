SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
cd $SCRIPTPATH

DB_PATH="./db"
DB_REPL_SET_NAME="drp_rs"
DB_CONFIG_PATH="mongod.conf"

mongod --replSet $DB_REPL_SET_NAME --logpath "logs/mongodb_rs0.log" --logappend --dbpath "$DB_PATH"/rs0 --port 27017 --config $DB_CONFIG_PATH &&
mongod --replSet $DB_REPL_SET_NAME --logpath "logs/mongodb_rs1.log" --logappend --dbpath "$DB_PATH"/rs1 --port 29017 --config $DB_CONFIG_PATH &&
mongod --replSet $DB_REPL_SET_NAME --logpath "logs/mongodb_rsh.log" --logappend --dbpath "$DB_PATH"/rsh --port 31017 --config $DB_CONFIG_PATH
