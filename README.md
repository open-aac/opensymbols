OpenSymbols
---------------------------
[![OpenAAC](https://www.openaac.org/images//OpenAAC-advocate-blue.svg)](https://www.openaac.org/advocates.html)

OpenSymbols is a ruby (Rails) server that makes it easy to collect 
and search
through multiple image repositories. It's built around the idea of
aggregating open-licensed picture symbols for AAC. It can search
local and remote repositories.

You can see the site live at https://www.opensymbols.org

## Setup

All local repositories need to be in the same S3 bucket and in a 
subfolder `/libraries`. They will also need a `manifest.json` file
that includes basic repository information. All the files in each
repository including manifest.json should be publicly available.

Once you have your repositories set up you can add them to your
site by executing the following command from the console on your
server or local computer:

```ruby
SymbolRepository.retrieve_from_manifest('<repository_folder>')
```

You'll need to set the environment variable, `S3_BUCKET=<yourbucketname>`
before the app will run. You can use the dotenv gem to easily set this
in development environments by editing the `.env` file (this option can work 
in production too, but it's not set that way by default).

You can check out a couple different `manifest.json` files in the
`/examples` folder of the project.

## License

Licensed under the MIT License.