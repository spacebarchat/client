{
  description = "Spacebar client, written in React.";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-22.11";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.pnpm2nix.url = "github:TheArcaneBrony/pnpm2nix";
  #inputs.pnpm2nix.url = "path:/home/root@Rory/git/spacebar/client/pnpm2nix";
  inputs.pnpm2nix.flake = false;

  outputs = { self, nixpkgs, flake-utils, pnpm2nix }:
    flake-utils.lib.eachDefaultSystem (system:
	let
		pkgs = import nixpkgs {
			inherit system;
		};
		_pnpm2nix = import pnpm2nix { pkgs = nixpkgs.legacyPackages.${system}; };
	in rec {
		packages.default = _pnpm2nix.mkPnpmPackage {
			src = ./.;
			buildInputs = with pkgs; [

			];
		};
		devShell = pkgs.mkShell {
			buildInputs = with pkgs; [
				nodejs
				nodePackages.pnpm
				nodePackages.typescript
			];
		};
	}
    );
}
