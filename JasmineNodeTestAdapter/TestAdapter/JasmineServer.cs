using JsTestAdapter.Helpers;
using JsTestAdapter.Logging;
using JsTestAdapter.TestServerClient;
using System;
using System.IO;
using TwoPS.Processes;

namespace JasmineNodeTestAdapter.TestAdapter
{
    public class JasmineServer : TestServer
    {
        public JasmineServer(Settings settings, ITestLogger logger)
            : base(logger)
        {
            if (!settings.AreValid)
            {
                throw new ArgumentException("Settings are not valid", "settings");
            }
            Settings = settings;
        }

        public Settings Settings { get; private set; }

        public override string Name
        {
            get { return "Jasmine"; }
        }

        public override string StartScript
        {
            get { return Path.Combine(Globals.LibDirectory, "Start.js"); }
        }

        public override string WorkingDirectory
        {
            get { return Path.GetDirectoryName(Settings.SettingsFile); }
        }

        protected override void AddOptions(ProcessOptions options)
        {
            options.Add("--name", Settings.Name);
            options.Add("--settings", PathUtils.GetRelativePath(WorkingDirectory, Settings.SettingsFile));
        }
    }
}