using JsTestAdapter.Helpers;
using JsTestAdapter.Logging;
using JsTestAdapter.TestAdapter;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.Logging;
using Microsoft.VisualStudio.TestWindow.Extensibility;
using System;

namespace JasmineNodeTestAdapter.TestAdapter
{
    public class JasmineTestAdapterInfo : TestAdapterInfo
    {
        public override string Name
        {
            get { return "Jasmine"; }
        }

        public override Uri ExecutorUri
        {
            get { return Globals.ExecutorUri; }
        }

        public override bool IsTestContainer(string file)
        {
            return PathUtils.PathHasFileName(file, Globals.SettingsFilename);
        }

        public override int GetContainerPriority(string file)
        {
            return 0;
        }

        public override string SettingsName
        {
            get { return JasmineTestSettings.SettingsName; }
        }

        public override string SettingsFileDirectory
        {
            get { return Globals.GlobalLogDir; }
        }

        public override ITestLogger CreateLogger(IMessageLogger logger)
        {
            return new JasmineLogger(logger);
        }

        public override ITestLogger CreateLogger(ILogger logger)
        {
            return new JasmineLogger(logger);
        }
    }
}