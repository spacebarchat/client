#!/usr/bin/env nix-shell
#!nix-shell -i "bash -x" -p nodejs nodePackages.ts-node prefetch-npm-deps bash
rm -rfv package-lock.json
npm i --save --ignore-scripts
DEPS_HASH=`prefetch-npm-deps package-lock.json`
sed 's/$NPM_HASH/'${DEPS_HASH/\//\\\/}'/g' flake.template.nix > flake.nix
#sha256-5iurI8d2mael4qR/gs4IeZpf5d6+QPBoZ+kvhrwoOIU=
