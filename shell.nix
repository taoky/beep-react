{ pkgs ? import <nixpkgs> {} }:

with pkgs; mkShell {
    buildInputs = [
        nodejs_22
        nodePackages.pnpm
    ];
}
