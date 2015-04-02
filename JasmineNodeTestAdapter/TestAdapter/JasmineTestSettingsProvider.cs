using JsTestAdapter.TestAdapter;
using Microsoft.VisualStudio.TestPlatform.ObjectModel;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.Adapter;
using Microsoft.VisualStudio.TestWindow.Extensibility;
using System.ComponentModel.Composition;

namespace JasmineNodeTestAdapter.TestAdapter
{
    [Export(typeof(ISettingsProvider))]
    [Export(typeof(IRunSettingsService))]
    [Export(typeof(JasmineTestSettingsProvider))]
    [SettingsName(JasmineTestSettings.SettingsName)]
    public class JasmineTestSettingsProvider : TestSettingsProvider
    {
        protected override TestSettings CreateTestSettings()
        {
            return new JasmineTestSettings();
        }
    }
}