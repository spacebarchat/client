#pragma once

#include "App.xaml.g.h"
#include "winrt/Microsoft.ReactNative.h"
#include <CppWinRTIncludes.h>

#ifdef USE_WINUI3
namespace activation = winrt::Microsoft::UI::Xaml;
#else
namespace activation = winrt::Windows::ApplicationModel::Activation;
#endif

namespace winrt::fosscord::implementation
{
    struct App : AppT<App>
    {
        App() noexcept;
        void OnLaunched(Windows::ApplicationModel::Activation::LaunchActivatedEventArgs const&);
        void OnSuspending(IInspectable const&, Windows::ApplicationModel::SuspendingEventArgs const&);
        void OnNavigationFailed(IInspectable const&, Windows::UI::Xaml::Navigation::NavigationFailedEventArgs const&);
    
        winrt::Microsoft::ReactNative::ReactNativeHost& Host() noexcept { return m_host; }
    private:
        winrt::Microsoft::ReactNative::ReactNativeHost m_host;
    };
} // namespace winrt::fosscord::implementation
