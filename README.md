# React Native Google Sign-In

Simple Google Sign-In package for React Native Android apps with Firebase integration.

> **Note**: This is a personal project created by Akshay Khapare. Feel free to use it in your projects if you find it helpful. While I maintain this for my own use, others are welcome to use, modify, or contribute to it.

## Features

- Easy Google Sign-In for Android
- Firebase Authentication
- Simple state management with Zustand

## Installation

```bash
npm install @akshay-khapare/react-native-google-signin
```

## Dependencies

Add these dependencies to your app's `package.json`:
```json
{
  "dependencies": {
    "@react-native-firebase/app": "^18.9.0",
    "@react-native-firebase/auth": "^18.9.0",
    "@react-native-google-signin/google-signin": "^10.0.1",
    "zustand": "^4.4.7"
  }
}
```

## Android Setup

1. Configure your `android/build.gradle`:
```gradle
buildscript {
    ext {
        googlePlayServicesAuthVersion = "20.7.0"
    }

    dependencies {
        classpath('com.google.gms:google-services:4.4.1')
    }
}
```

2. Configure your `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation "com.google.android.gms:play-services-auth:${rootProject.ext.googlePlayServicesAuthVersion}"
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-auth'
}
```

3. Add Firebase configuration:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Add your Android app to the Firebase project
   - Download `google-services.json` from Firebase Console
   - Place it in `android/app/`
   - Add your SHA-1 signing certificate fingerprint in Firebase project settings under your Android app
   - Follow [Firebase setup guide](https://rnfirebase.io/#installation) for complete setup

## Usage

```typescript
import { GoogleSignIn, useAuthStore } from '@akshay-khapare/react-native-google-signin';

// Initialize in App.tsx or similar
GoogleSignIn.configure({
  webClientId: 'your-web-client-id',  // Required
  offlineAccess: false,               // Optional, defaults to false
  hostedDomain: 'your-domain.com'     // Optional
});

// Using the auth store
const {
  isLoading,   // Loading state (boolean)
  isError,     // Error message or null
  googleSignIn, // Sign in function returns Promise<FirebaseAuthTypes.UserCredential | null>
  signOut,     // Sign out function returns Promise<void>
  resetState   // Reset store state to initial values
} = useAuthStore();

// Example usage in a component
function LoginScreen() {
  const { isLoading, isError, googleSignIn, signOut } = useAuthStore();

  const handleSignIn = async () => {
    const userCredential = await googleSignIn();
    if (userCredential) {
      console.log('Signed in user:', userCredential.user.displayName);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    console.log('User signed out');
  };

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Sign In" onPress={handleSignIn} />
      )}
      {isError && <Text style={{ color: 'red' }}>{isError}</Text>}
    </View>
  );
}
```

## Error Handling

The package includes built-in error handling for common scenarios:

| Error Code | Description | Resolution |
|------------|-------------|------------|
| INVALID_CONFIG | Invalid configuration parameters | Check your webClientId and configuration |
| NO_ID_TOKEN | No ID token received from Google | Ensure proper Firebase setup |
| SIGN_IN_CANCELLED | User cancelled the sign-in | Handle as a normal user action |
| IN_PROGRESS | Sign-in already in progress | Wait for the current operation to complete |
| PLAY_SERVICES_NOT_AVAILABLE | Google Play Services not available | Prompt user to install/update Play Services |
| SIGN_IN_FAILED | Generic sign-in failure | Check error message for details |
| SIGN_OUT_FAILED | Failed to sign out | Check if user was signed in |

## Complete Example

```typescript
import { GoogleSignIn, useAuthStore } from '@akshay-khapare/react-native-google-signin';
import { View, Button, ActivityIndicator, Text } from 'react-native';

// Initialize
await GoogleSignIn.configure({
  webClientId: 'your-web-client-id',
  offlineAccess: true
});

function AuthScreen() {
  const { isLoading, isError, googleSignIn, signOut } = useAuthStore();

  const handleSignIn = async () => {
    const userCredential = await googleSignIn();
    if (userCredential) {
      // User successfully signed in
      const { displayName, email, photoURL } = userCredential.user;
      console.log('User signed in:', { displayName, email, photoURL });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    console.log('User signed out');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Sign In with Google" onPress={handleSignIn} />
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      )}
      {isError && (
        <Text style={{ color: 'red', marginTop: 10 }}>{isError}</Text>
      )}
    </View>
  );
}
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
