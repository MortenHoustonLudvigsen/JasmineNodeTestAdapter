@ECHO OFF
setlocal

cd %~dp0
set CurrentDir=%CD%
cd %~dp0..\..
set SolutionDir=%CD%
set TestProjectsDir=%SolutionDir%\TestProjects
set TestServer=%SolutionDir%\JasmineNodeTestAdapter\JasmineTestServer\Start.js

:: Set NODE_PATH to simulate starting node from %CurrentDir%
set NODE_PATH=%CurrentDir%\node_modules
set NODE_PATH=%NODE_PATH%;%TestProjectsDir%\node_modules
set NODE_PATH=%NODE_PATH%;%SolutionDir%\node_modules;%AppData%\Roaming\npm\node_modules

:: Add the default path to the global node_modules:
set NODE_PATH=%NODE_PATH%;%AppData%\Roaming\npm\node_modules

:: Run jasmine specs using JasmineRunner.js
node "%TestServer%" --settings "%CurrentDir%\JasmineNodeTestAdapter.json" --singleRun
