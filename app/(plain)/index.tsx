import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
    useEffect(() => {
        router.push("/(tabs)/projects/list");
    }, []);
    return null;
}