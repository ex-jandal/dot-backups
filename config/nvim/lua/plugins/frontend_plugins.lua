return {
{
  "luckasRanarison/tailwind-tools.nvim",
  lazy = false,
  build = ":UpdateRemotePlugins",
  config = function()
    require("tailwind-tools").setup {
      autocompletion = true,
    }
  end,
},
{
  "vuejs/vetur",
  opts = {
    ensure_installed = {
      "vls",
    },
  },
},
}
