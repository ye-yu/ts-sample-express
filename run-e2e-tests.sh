# runs all test files
rm -rf out && npx swc --config-file .swcrc.dev src -s -d out
export NODE_ENV=testing
export LOG_LEVEL=silent

run() {
  jsfilename=$(basename $0)
  tsfilename=$(node -p -e "'$0'.replace(/(^out\/)|(\.js$)/g, '')+'.ts'")
  directory_name=$(dirname "$0")
  temp_out_file="/tmp/ts-sample-express-$jsfilename.out"
  temp_err_file="/tmp/ts-sample-express-$jsfilename.err"
  echo "" > $temp_out_file
  echo "" > $temp_err_file

  printf "\e[0;33mRunning\e[0m $tsfilename\n"
  test_result=$(node -r source-map-support/register -r reflect-metadata --test $0 | node parse-tap.mjs 2>&1)
  if echo "$test_result" | grep -q "^test failed"
  then
    echo "\e[0;31m(File)\e[0m: $tsfilename" >> "$temp_err_file"
    echo "$test_result" >> "$temp_err_file"
    echo "" >> "$temp_err_file"
    printf "\e[0;31mFailed\e[0m $tsfilename\n"
  else
    echo "\e[0;33m(File)\e[0m: $tsfilename" >> "$temp_out_file"
    echo "$test_result" >> "$temp_out_file"
    echo "" >> "$temp_out_file"
    printf "\e[0;33mPassed\e[0m $tsfilename\n"
  fi
}

rm /tmp/ts-sample-express-*

if [ -z $1 ]
then 
  export -f run
  find out -maxdepth 10 | grep "e2e-spec.js$" | xargs -P10 -I {} bash -c run {}
  test_result=$(cat /tmp/ts-sample-express-*.out)
  printf "$test_result"
  failed_result=$(cat /tmp/ts-sample-express-*.err)
  printf "$failed_result"

  if echo "$failed_result" | grep -q "^test failed"
  then
      exit 1
  fi
else
  jsfilename=$(node -p -e "'out/' + '$1'.replace(/(^src\/)|(\.ts$)/g, '')+'.js'")
  printf "\e[0;33mRunning\e[0m $jsfilename\n"
  node --test-reporter=tap -r source-map-support/register -r reflect-metadata --test "$jsfilename" | node parse-tap.mjs
fi