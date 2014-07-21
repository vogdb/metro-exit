clear

usage(){
	echo "Usage: $0 directory"
	exit 1
}

[[ $# -eq 0 ]] && usage

directory(){
    local FILE_NAME
    local FILE_EXT
    for f in $1/*
    do
        FILE_NAME=$(basename $f)
        FILE_EXT=${FILE_NAME##*.}
        if [ "$FILE_EXT" = "png" ]
        then
            #echo "optimizing $f file.."
            optipng $f;
        elif [ -d "$f" ];then
            echo "going dir $f"
            directory $f;
        fi
    done
}

for var in "$@"
do
    directory $var
done
