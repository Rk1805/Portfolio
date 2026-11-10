for i in 1 2 3; do node lh.mjs > lhrun$i.txt 2>&1; mv lh3a.json lh3_run$i.json; done; touch lh-multi.done
