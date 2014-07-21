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
        if [ "$FILE_EXT" = "png" -o "$FILE_EXT" = "jpg" ]
        then
            echo "Composing $f file.."
            #OUTPUT_FILE="composed.`basename $f`"
            convert -pointsize 24 -size 500x220 xc:none -fill "#80808080" -gravity Center -draw "rotate -10 text 5,15 'www.metroexit.ru, www.метровыход.рф'" miff:- | composite -tile - $f $f;
        elif [ -d "$f" ];then
            directory $f;
        fi
    done
}

directory $1