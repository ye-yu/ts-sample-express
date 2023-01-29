distFile=$(echo $1 | sed "s/^src/dist/" | sed "s/.ts\$/.js/")
echo "running: $distFile"
node -r source-map-support/register -r reflect-metadata $distFile