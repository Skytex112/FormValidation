import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegistrationSchema, UserRegistrationFormData } from "../schemas/userSchema";
import * as Crypto from "expo-crypto";
import { useSQLiteContext } from "expo-sqlite";
import { createUser } from "../database/database";


export const RegistartionScreen: React.FC = () => {
    const db = useSQLiteContext();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UserRegistrationFormData>({
        resolver: zodResolver(userRegistrationSchema),
        defaultValues: {
            firstName: '',
            email: '',
            age: "" as unknown as number,
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: UserRegistrationFormData) => {
        try {
            const passwordHash = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                data.password
            );

            await createUser(db, data, passwordHash);
            const users = await db.getAllAsync<{
                id: number;
                first_name: string;
                email: string;
                age: number;
                created_at: string;
            }>(
                "SELECT id, first_name, email, age, created_at FROM users"
            );

            console.log("Users in SQLite:", users);

            Alert.alert("Success", "Registration completed");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Registration failed";

            Alert.alert("Error", message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Registration</Text>
            <Text style={styles.subheader}>Form</Text>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Name</Text>
                <Controller
                    control={control}
                    name='firstName'
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.firstName && styles.inputError]}
                            placeholder="Input name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value ?? ''}
                        />
                    )}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="Input email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Age</Text>
                <Controller
                    control={control}
                    name='age'
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.firstName && styles.inputError]}
                            placeholder="Input age"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            value={value != undefined && value !== null ? String(value) : ''}
                        />
                    )}
                />
                {errors.age && <Text style={styles.errorText}>{errors.age.message}</Text>}
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Password</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                errors.password && styles.inputError,
                            ]}
                            placeholder="Input password"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.password && (
                    <Text style={styles.errorText}>{errors.password.message} </Text>
                )}
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Confirm password</Text>
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                errors.confirmPassword && styles.inputError,
                            ]}
                            placeholder="Repeat password"
                            secureTextEntry
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                )}
            </View>

            <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f8fafc', paddingTop: 60, paddingBottom: 40 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginBottom: 4 },
    subheader: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 },
    fieldContainer: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, height: 48, fontSize: 16, color: '#0f172a' },
    inputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
    errorText: { color: '#ef4444', fontSize: 12, marginTop: 4, marginLeft: 2 },
    button: { backgroundColor: '#6366f1', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});