package app.llcloud.stories

import android.app.Application
import io.sentry.SentryOptions
import io.sentry.android.core.SentryAndroid

class StoriesApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        if (!BuildConfig.DEBUG) {
            SentryAndroid.init(this) { options ->
                options.dsn =
                    "https://5afb75d2c86f0ee5978ecfbd53868f55@o4507369077538816.ingest.de.sentry.io/4511648873316432"
                options.environment = "production"

                options.beforeSend = SentryOptions.BeforeSendCallback { event, _ ->
                    val origin = event.throwable?.stackTrace?.firstOrNull()?.className.orEmpty()
                    val isUnfixableGoogleNpe =
                        origin.startsWith("com.google.android.datatransport") ||
                            origin.contains("ProxyBillingActivity")
                    if (isUnfixableGoogleNpe) null else event
                }
            }
        }
    }
}
