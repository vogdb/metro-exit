usage(){
	echo "Usage: $0 directory"
	exit 1
}

[ $# -eq 0 ] && usage

advanced(){
    local FILE_NAME
    local FILE_EXT
    for f in $1/*
    do
        FILE_NAME=$(basename $f)
        FILE_EXT=${FILE_NAME##*.}
        if [ "${FILE_NAME#*Loader}" != "$FILE_NAME" -o "${FILE_NAME#*Bootstrap}" != "$FILE_NAME" -a "$FILE_EXT" = "js" ]
        then
            java -jar ~/programs/gcc/build/compiler.jar \
            --js $f --js_output_file $f.tmp;
            mv $f.tmp $f;
        elif [ "$FILE_EXT" = "js" ]
        then
            #echo "optimizing $f file.."
            java -jar ~/programs/gcc/build/compiler.jar \
            --compilation_level ADVANCED_OPTIMIZATIONS \
            --externs ~/programs/gcc/externs/google_maps_api_v3.js \
            --js $f --js_output_file $f.tmp;
            mv $f.tmp $f;
        fi
    done
}

advanced $1