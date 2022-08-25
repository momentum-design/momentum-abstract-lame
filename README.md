# momentum-abstract-lame
Tools for converting wav to mp3 for Momentum-sonic

## lame
remove lame_init_old in lame-3.100/include/libmp3lame.sym
lame_init_old will cause bugs so we removed it.

## usage

### init lame

If you have not lame in your device, run the script to install lame.

```
    sudo npm run intall-lame
```

or 

```
    cd lame-3.100 && ./configure && make && sudo make install
```

### default

1. create the input folder in the root.
2. put the wav files under input folder.
3. run ```npm run convert```
4. the output file will be under output folder in the root.

### set input ant outpath path

You can pass input and outpath when you run the script

```
npm run convert input='sound/input'  output='sound/output'
```