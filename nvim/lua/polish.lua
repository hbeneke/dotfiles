vim.env.PATH = "C:\\Users\\User\\AppData\\Local\\Microsoft\\WinGet\\Links;" .. vim.env.PATH
vim.opt.clipboard = "unnamedplus"
vim.opt.shell = "powershell"
vim.opt.shellcmdflag = "-NoLogo -NoProfile -ExecutionPolicy RemoteSigned -Command"
vim.opt.shellxquote = ""
vim.opt.shellquote = ""
vim.opt.shellpipe = "| Out-File -Encoding UTF8 %s"
vim.opt.shellredir = "| Out-File -Encoding UTF8 %s"
