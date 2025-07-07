local M = {
  {
    "stevearc/conform.nvim",
    -- event = 'BufWritePre', -- uncomment for format on save
    opts = require "configs.conform",
  },

  -- These are some examples, uncomment them if you want to see them work!
  {
    "neovim/nvim-lspconfig",
    config = function()
      require "configs.lspconfig"
    end,
  },

  -- test new blink
  -- { import = "nvchad.blink.lazyspec" },

  -- {
  -- 	"nvim-treesitter/nvim-treesitter",
  -- 	opts = {
  -- 		ensure_installed = {
  -- 			"vim", "lua", "vimdoc",
  --      "html", "css"
  -- 		},
  -- 	},
  -- },

    {
    "nvim-treesitter/nvim-treesitter",
    opts = {
      ensure_installed = {
        "vim",
        "lua",
        "vimdoc",
        "html",
        "css",
        "markdown",
        "rust",
        "python",
        "vue",
        "svelte",
      },
      highlight = { enable = true },
    },
  },

  {
    'derektata/lorem.nvim',
    config = function()
        require('lorem').opts {
            sentence_length = "medium",
            comma_chance = 0.2,
            max_commas = 2,
        }
    end,
  },

  {'nvim-java/nvim-java'},

  {"CRAG666/code_runner.nvim", config = true},

  {
    'nvim-flutter/flutter-tools.nvim',
    lazy = false,
    dependencies = {
        'nvim-lua/plenary.nvim',
        'stevearc/dressing.nvim', -- optional for vim.ui.select
    },
    config = true,
  },

  {
    "christoomey/vim-tmux-navigator",
    lazy = false,
  },

  {
    "folke/todo-comments.nvim",
    lazy = false,
    config = function()
      require("todo-comments").setup()
    end,
    dependencies = { "nvim-lua/plenary.nvim" },
  },

  {
    "williamboman/mason.nvim",
    opts = {
      ensure_installed = {
        "marksman",
        "html",
        "cssls",
        "ts_ls",
        "tailwindcss-language-server",
        "svelte",
        "vls",
        "pyright",
        "texlab",
        "clangd",
        "intelephense",
        "nil_ls",
        "dcm",
        "jdtls",
        "sqls",
        "codelldb"
      },
    },
  },

  {
    "lervag/vimtex",
    ft = { "tex" },
    init = function()
      vim.g.tex_flavor = "latex"
      vim.g.vimtex_view_method = 'sioyek'
      vim.g.vimtex_quickfix_mode = 0
      vim.g.vimtex_mappings_enabled = 1
      vim.g.vimtex_indent_enabled = 0

      -- vim.g.vimtex_view_method = "zathura"
      vim.g.vimtex_context_pdf_viewer = "sioyek"


    end,
  },

  {
    "patrickpichler/hovercraft.nvim",

    dependencies = {
      { "nvim-lua/plenary.nvim" },
    },

    -- this is the default config and can be skipped
    opts = function()
      return {
        providers = {
          providers = {
            {
              "LSP",
              require("hovercraft.provider.lsp.hover").new(),
            },
            {
              "Man",
              require("hovercraft.provider.man").new(),
            },
            {
              "Dictionary",
              require("hovercraft.provider.dictionary").new(),
            },
          },
        },

        window = {
          border = "single",

          -- enable this if you are a user of the MeanderingProgrammer/render-markdown.nvim plugin
          -- render_markdown_compat_mode = true,
        },

        keys = {
          {
            "<C-u>",
            function()
              require("hovercraft").scroll { delta = -4 }
            end,
          },
          {
            "<C-d>",
            function()
              require("hovercraft").scroll { delta = 4 }
            end,
          },
          {
            "<TAB>",
            function()
              require("hovercraft").hover_next()
            end,
          },
          {
            "<S-TAB>",
            function()
              require("hovercraft").hover_next { step = -1 }
            end,
          },
        },
      }
    end,

    keys = {
      {
        "K",
        function()
          local hovercraft = require "hovercraft"

          if hovercraft.is_visible() then
            hovercraft.enter_popup()
          else
            hovercraft.hover()
          end
        end,
      },
    },
  },
}

table.insert(M, require "plugins.rust_plugins")
table.insert(M, require "plugins.dap_plugins")
table.insert(M, require "plugins.snacks")
table.insert(M, require "plugins.frontend_plugins")

return M
