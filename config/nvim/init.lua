vim.g.base46_cache = vim.fn.stdpath "data" .. "/base46/"
vim.g.mapleader = " "

-- bootstrap lazy and all plugins
local lazypath = vim.fn.stdpath "data" .. "/lazy/lazy.nvim"

if not vim.uv.fs_stat(lazypath) then
  local repo = "https://github.com/folke/lazy.nvim.git"
  vim.fn.system { "git", "clone", "--filter=blob:none", repo, "--branch=stable", lazypath }
end

vim.opt.rtp:prepend(lazypath)

local lazy_config = require "configs.lazy"

-- load plugins
require("lazy").setup({
  {
    "NvChad/NvChad",
    lazy = false,
    branch = "v2.5",
    import = "nvchad.plugins",
  },

  { import = "plugins" },
}, lazy_config)

require('code_runner').setup({
  filetype = {
    java = {
      -- "cd $dir &&",
      -- "javac $fileName && java $fileNameWithoutExt",

      -- "cd $dir && mvn compile exec:java"

      "mvn clean install && java -cp target/${basename $PWD}.jar com.example.App"
    },
    python = "python3 -u",
    typescript = "deno run",
    rust = {
      "cd $dir &&",
      "rustc $fileName &&",
      "$dir/$fileNameWithoutExt"
    },
    c = function(...)
      c_base = {
        "cd $dir &&",
        "gcc $fileName -o",
        "/tmp/$fileNameWithoutExt",
      }
      local c_exec = {
        "&& /tmp/$fileNameWithoutExt &&",
        "rm /tmp/$fileNameWithoutExt",
      }
      vim.ui.input({ prompt = "Add more args:" }, function(input)
        c_base[4] = input
        vim.print(vim.tbl_extend("force", c_base, c_exec))
        require("code_runner.commands").run_from_fn(vim.list_extend(c_base, c_exec))
      end)
    end,
  },
})

-- require("cmp").setup({
--   window = {
--     completion = {
--       border = "rounded"
--     },
--     documentation = {
--       border = "rounded"
--     }
--   }
-- })

 vim.lsp.handlers["textDocument/hover"] = vim.lsp.with(
   vim.lsp.handlers.hover, {
     -- Use a sharp border with `FloatBorder` highlights
     border = "single",
     -- add the title in hover float window
     title = "hover"
   }
 )

-- vim.lsp.inlay_hint.enable(not vim.lsp.inlay_hint.is_enabled { 0 }, { 0 })
-- vim.wo.relativenumber = true
vim.opt.smartindent = true -- Smart indentation for new lines

-- for vue.js 
local luasnip = require 'luasnip'
luasnip.filetype_extend("vue", { "javascript", "html", "css" })

-- for lorem
require('lorem').opts {
    sentence_length = "mixed",  -- using a default configuration
    comma_chance = 0.3,  -- 30% chance to insert a comma
    max_commas = 2  -- maximum 2 commas per sentence
}

-- load theme
dofile(vim.g.base46_cache .. "defaults")
dofile(vim.g.base46_cache .. "statusline")

require "options"
require "autocmds"

vim.schedule(function()
  require "mappings"
end)
