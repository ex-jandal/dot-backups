require("nvchad.configs.lspconfig").defaults()

local servers = { "marksman", "html", "cssls", "ts_ls", "tailwindcss-language-server", "svelte", "vls", "pyright", "texlab", "clangd", "intelephense", "nil_ls", "dcm" ,"jdtls", "sqls" }
vim.lsp.enable(servers)

-- read :h vim.lsp.config for changing options of lsp servers 

local lspconfig = require "lspconfig"
lspconfig.volar.setup {
  -- add filetypes for typescript, javascript and vue
  filetypes = { 'typescript', 'javascript', 'javascriptreact', 'typescriptreact', 'vue' },
  init_options = {
    vue = {
      -- disable hybrid mode
      hybridMode = false,
    },
    javascriptreact = {
      hybridMode = false,
    },
    typescriptreact = {
      hybridMode = false,
    },
  },
}

lspconfig.eslint.setup({})

