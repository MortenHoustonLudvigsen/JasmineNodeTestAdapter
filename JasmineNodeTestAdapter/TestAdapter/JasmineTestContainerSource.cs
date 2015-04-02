using JsTestAdapter.Helpers;
using JsTestAdapter.TestAdapter;
using Microsoft.VisualStudio.Shell.Interop;
using System.IO;
using System.Linq;

namespace JasmineNodeTestAdapter.TestAdapter
{
    public class JasmineTestContainerSource : TestContainerSource
    {
        public JasmineTestContainerSource(IVsProject project, string source)
            : base(project, GetSource(project, source))
        {
        }

        private static string GetSource(IVsProject project, string source)
        {
            var directory = Directory.Exists(source) ? source : Path.GetDirectoryName(source);
            var candidates = new[]{
                Path.Combine(directory, Globals.SettingsFilename)
            };
            return candidates.FirstOrDefault(f => project.HasFile(f));
        }
    }
}