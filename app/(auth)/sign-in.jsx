import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { styles } from '@/assets/styles/auth.styles'
import { Image } from 'expo-image'
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from "@/constants/colors"

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const [error, setError] = React.useState('')
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            if (err.errors?.[0]?.code === "form_password_incorrect") {
                setError("Password is incorrect. Please try again.")
            }else {
                setError("An error occured. Please try again.")
            }
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            // console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            <SafeAreaView style={styles.container}>
                <Image
                    source={require("@/assets/images/revenue-i4.png")}
                    style={styles.illustration}
                />
                <Text style={styles.title}>Sign in</Text>
                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError("")}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ) : null}
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize='none'
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity onPress={onSignInPress} style={styles.button}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Link href="/sign-up" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}