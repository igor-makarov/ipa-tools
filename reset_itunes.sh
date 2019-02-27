
#!/bin/bash

./exit_itunes.sh
./base_runner.sh 'rm -rf ~/"Music/iTunes/iTunes Media/Mobile Applications"/*'
./base_runner.sh 'rm -rf ~/"Music/iTunes/iTunes Library"*'
