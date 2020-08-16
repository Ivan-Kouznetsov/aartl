if npm run test && npm run build
then
cd dist 
pkg aartl.js

mkdir windows
mkdir linux
mkdir macOs

./aartl-win.exe -f example.aartl
wsl ./aartl-linux -f example.aartl

mv aartl-win.exe ./windows/aartl.exe
mv aartl-linux ./linux/aartl
mv aartl-macos ./macos/aartl

cp example.aartl ./windows/
cp example.aartl ./linux/
cp example.aartl ./macos/

cp report.css ./windows/
cp report.css ./linux/
cp report.css ./macos/

7z a windows.zip ./windows/*
7z a linux.zip ./linux/*
7z a macos.zip ./macos/*

else
echo something went wrong
echo see readme.md for requirements
fi
