using JsTestAdapter.Helpers;
using JsTestAdapter.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace JasmineNodeTestAdapter.TestAdapter
{
    public class Settings
    {
        public Settings(string name, string configFile, Func<string, bool> fileExists, string baseDirectory, ITestLogger logger)
        {
            Name = name;
            Logger = logger;

            try
            {
                Directory = Path.GetDirectoryName(configFile);
                SettingsFile = configFile;
                Json.PopulateFromFile(SettingsFile, this);

                Name = Name ?? name;
                BatchInterval = BatchInterval ?? 250;

                if (AreValid)
                {
                    LogDirectory = GetFullPath(LogDirectory ?? "");
                    if (LogToFile)
                    {
                        logger.AddLogger(LogFilePath);
                    }
                }
                else
                {
                    LogDirectory = "";
                    LogToFile = false;
                }
            }
            catch (Exception ex)
            {
                _validator.Validate(false, "Could not read settings: {0}", ex.Message);
                logger.Error(ex, "Could not read settings");
            }
        }

        /// <summary>
        /// The name of the test container
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The base path to use to resolve file paths.
        /// Defaults to the directory in which JasmineNodeTestAdapter.json resides.
        /// </summary>
        public string BasePath { get; set; }

        /// <summary>
        /// Non-source, non-spec helper files. Loaded before any specs.
        /// Wildcards can be used - <see href="https://www.npmjs.com/package/glob">glob</see>.
        /// </summary>
        public IEnumerable<string> Helpers { get; set; }

        /// <summary>
        /// Files containing Jasmine specs.
        /// Wildcards can be used - <see href="https://www.npmjs.com/package/glob">glob</see>.
        /// </summary>
        public IEnumerable<string> Specs { get; set; }

        /// <summary>
        /// A test run is triggered if any file specified in `Helpers` or `Specs` change.
        /// Add any files in `Watch` that should also trigger a test run when they change.
        /// These will typically be the source files.
        /// Wildcards can be used - <see href="https://www.npmjs.com/package/glob">glob</see>.
        /// </summary>
        public IEnumerable<string> Watch { get; set; }

        /// <summary>
        /// When the test adapter is watching files for changes, it will wait BatchInterval ms
        /// before running tests.
        /// Default value is 250.
        /// </summary>
        public int? BatchInterval { get; set; }

        /// <summary>
        /// Path to a node.js module implementing extensions
        /// </summary>
        public string Extensions { get; set; }

        /// <summary>
        /// True if the test adapter should be disabled for this karma configuration file
        /// </summary>
        public bool Disabled { get; set; }

        /// <summary>
        /// Should logging be done to a file as well as normal logging
        /// </summary>
        public bool LogToFile { get; set; }

        /// <summary>
        /// Where the log file should be saved (if LogToFile is true). If this property is not
        /// specified the directory in which settings file resides is used.
        /// </summary>
        public string LogDirectory { get; set; }

        private readonly Validator _validator = new Validator();

        /// <summary>
        /// Indicates whether settings have been loaded successfully
        /// </summary>
        [JsonIgnore]
        public bool AreValid { get { return _validator.IsValid; } }

        /// <summary>
        /// Indicates the reason why the settings are invalid
        /// </summary>
        /// [JsonIgnore]
        public string InvalidReason { get { return _validator.InvalidReason; } }

        /// <summary>
        /// The path of the adapter settings file
        /// </summary>
        [JsonIgnore]
        public string SettingsFile { get; private set; }

        /// <summary>
        /// Directory of the settings file
        /// </summary>
        [JsonIgnore]
        public string Directory { get; private set; }

        /// <summary>
        /// The logger
        /// </summary>
        [JsonIgnore]
        public ITestLogger Logger { get; private set; }

        /// <summary>
        /// The file to log to when LogToFile == true
        /// </summary>
        public string LogFilePath { get { return GetFullPath(LogDirectory, Globals.LogFilename); } }

        private string GetFullPath(params string[] paths)
        {
            return GetFullPath(Path.Combine(paths));
        }

        private string GetFullPath(string path)
        {
            return PathUtils.GetFullPath(string.IsNullOrWhiteSpace(path) ? "." : path, Directory);
        }
    }
}
