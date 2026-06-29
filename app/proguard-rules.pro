-dontobfuscate
-keepattributes SourceFile,LineNumberTable

# Sentry
-keep class io.sentry.** { *; }

# RevenueCat
-keep class com.revenuecat.purchases.** { *; }

# Hilt
-keep class dagger.hilt.** { *; }
-keep class * extends dagger.hilt.internal.GeneratedComponent { *; }

# Proto DataStore
-keep class * extends com.google.protobuf.GeneratedMessageLite { *; }

# Compose
-keep,allowobfuscation,allowshrinking interface androidx.compose.** { *; }
