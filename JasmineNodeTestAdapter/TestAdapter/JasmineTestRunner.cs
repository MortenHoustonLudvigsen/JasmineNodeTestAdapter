using JsTestAdapter.TestAdapter;
using Microsoft.VisualStudio.TestPlatform.ObjectModel;

namespace JasmineNodeTestAdapter.TestAdapter
{
    [FileExtension(".json")]
    [DefaultExecutorUri(Globals.ExecutorUriString)]
    [ExtensionUri(Globals.ExecutorUriString)]
    public class JasmineTestRunner : TestRunner
    {
        public override TestAdapterInfo CreateTestAdapterInfo()
        {
            return new JasmineTestAdapterInfo();
        }
    }
}