using JsTestAdapter.Helpers;
using JsTestAdapter.Logging;
using JsTestAdapter.TestAdapter;
using JsTestAdapter.TestServerClient;
using Microsoft.VisualStudio.Shell.Interop;
using System.Collections.Generic;
using System.IO;

namespace JasmineNodeTestAdapter.TestAdapter
{
    public class JasmineTestContainer : TestContainer
    {
        public JasmineTestContainer(TestContainerList containers, IVsProject project, string source)
            : base(containers, project, source)
        {
        }

        protected override void Init()
        {
            Settings = new Settings(Name, Source, f => File.Exists(f), BaseDirectory, Logger);
            Validate(Settings.AreValid, Settings.InvalidReason);
            if (Settings.AreValid)
            {
                Validate(Project.HasFile(Settings.SettingsFile), "File {1} is not included in project {0}", Project.GetProjectName(), GetRelativePath(Settings.SettingsFile));
            }

            if (Settings.Disabled)
            {
                Validate(false, string.Format("Jasmine is disabled in {0}", GetRelativePath(Settings.SettingsFile)));
            }
        }

        public Settings Settings { get; private set; }

        protected override TestServerLogger CreateServerLogger()
        {
            return new JasmineServerTestLogger(Logger);
        }

        protected override TestServer CreateTestServer()
        {
            return new JasmineServer(Settings, Logger);
        }

        public override bool HasFile(string file)
        {
            return PathUtils.PathsEqual(file, Settings.SettingsFile);
        }

        public override IEnumerable<string> GetFilesToWatch()
        {
            yield return Settings.SettingsFile;
        }

        public override bool IsDuplicate(TestContainer other)
        {
            return base.IsDuplicate(other);
        }

        public override int Priority
        {
            get { return base.Priority; }
        }
    }
}