netstat -o -n -a | findstr 3001
if %ERRORLEVEL% neq 0 (
  start cmd.exe /k "npm run start-auth --prefix mock-api"
)
npm run start