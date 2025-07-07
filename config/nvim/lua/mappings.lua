require "nvchad.mappings"

-- add yours here

local map = vim.keymap.set
local opts = { noremap = true, silent = true }

local function merge_opts(extra)
  return vim.tbl_extend("force", opts, extra or {})
end

map("n", ";", ":", { desc = "CMD enter command mode" })
map("i", "jk", "<ESC>")

-- map({ "n", "i", "v" }, "<C-s>", "<cmd> w <cr>")

-- DAP UI
map("n", "<Leader>du", "<cmd>lua require'dapui'.toggle()<CR>", merge_opts { desc = "open up the dap ui" })

-- DAP
map("n", "<Leader>dl", "<cmd>lua require'dap'.step_into()<CR>", merge_opts { desc = "Debugger step into" })
map("n", "<Leader>dj", "<cmd>lua require'dap'.step_over()<CR>", merge_opts { desc = "Debugger step over" })
map("n", "<Leader>dk", "<cmd>lua require'dap'.step_out()<CR>", merge_opts { desc = "Debugger step out" })
map("n", "<Leader>dc", "<cmd>lua require'dap'.continue()<CR>", merge_opts { desc = "Debugger continue" })
map(
  "n",
  "<Leader>db",
  "<cmd>lua require'dap'.toggle_breakpoint()<CR>",
  merge_opts { desc = "Debugger toggle breakpoint" }
)
map(
  "n",
  "<Leader>dd",
  "<cmd>lua require'dap'.set_breakpoint(vim.fn.input('Breakpoint condition: '))<CR>",
  merge_opts { desc = "Debugger set conditional breakpoint" }
)
map("n", "<Leader>de", "<cmd>lua require'dap'.terminate()<CR>", merge_opts { desc = "Debugger reset" })
map("n", "<Leader>dr", "<cmd>lua require'dap'.run_last()<CR>", merge_opts { desc = "Debugger run last" })

-- Don't yank on delete/change
-- map("n", "d", '"_d', opts)
-- map("n", "D", '"_D', opts)
-- map("n", "c", '"_c', opts)
-- map("n", "C", '"_C', opts)
-- map("n", "x", '"_x', opts)
-- map("n", "X", '"_X', opts)
-- map("v", "d", '"_d', opts)
-- map("v", "x", '"_x', opts)

-- Reselect again when indenting with > or <
map("v", ">", ">gv", opts)
map("v", "<", "<gv", opts)

-- moving the line up and down
map("n", "<A-C-k>", ":m .-2<CR>==", { noremap = true, silent = true })
map("n", "<A-C-j>", ":m .+1<CR>==", { noremap = true, silent = true })

map("v", "<A-C-k>", ":m '<-2<CR>gv=gv", { noremap = true, silent = true })
map("v", "<A-C-j>", ":m '>+1<CR>gv=gv", { noremap = true, silent = true })

-- LSP-related keymaps
map("n", "<Leader>ca", vim.lsp.buf.code_action, { noremap = true, silent = true, desc = "code action" })
map("n", "gd", vim.lsp.buf.definition, { noremap = true, silent = true, desc = "goto definition" })
map("n", "gD", vim.lsp.buf.declaration, { noremap = true, silent = true, desc = "goto declaration" })
map("n", "gi", vim.lsp.buf.implementation, { noremap = true, silent = true, desc = "goto implementation" })
map("n", "gr", vim.lsp.buf.references, { noremap = true, silent = true, desc = "goto references" })
-- map("n", "<Leader>rn", vim.lsp.buf.rename, { noremap = true, silent = true, desc = "rename" })

-- open up the full error
map("n", "E", vim.diagnostic.open_float)


-- map("n", "<Leader>cc", ":VimtexCompile<CR>", { noremap = true, silent = true, desc = "Compile PDF" })
map("n", "<Leader>cv", ":VimtexView<CR>", { noremap = true, silent = true, desc = "View PDF" })
map("n", "<Leader>cq", ":VimtexStop<CR>", { noremap = true, silent = true, desc = "Stop VimTeX" })

map("n", "<Leader>cc", "<CMD> w | silent ! latexmk -xelatex %<CR>", { noremap = true, silent = true, desc = "Vimtex Compile" })

vim.keymap.set('n', '<leader>rr', ':RunCode<CR>', { noremap = true, silent = false })
vim.keymap.set('n', '<leader>rf', ':RunFile<CR>', { noremap = true, silent = false })
vim.keymap.set('n', '<leader>rft', ':RunFile tab<CR>', { noremap = true, silent = false })
vim.keymap.set('n', '<leader>rp', ':RunProject<CR>', { noremap = true, silent = false })
vim.keymap.set('n', '<leader>rc', ':RunClose<CR>', { noremap = true, silent = false })
vim.keymap.set('n', '<leader>crf', ':CRFiletype<CR>', { noremap = true, silent = false })
vim.keymap.set('n', '<leader>crp', ':CRProjects<CR>', { noremap = true, silent = false })
