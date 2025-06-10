import { index, route } from "@react-router/dev/routes";

export default [
    index("app/routes/root.jsx", {
        children: [
            index("app/routes/main.jsx"), // This will match the root path "/"
            route("new", "app/routes/new.jsx"), // This will match "/new"
            route("edit/:id", "app/routes/edit.jsx") // This will match "/edit/:id"
        ],
        errorElement: "app/error-page.jsx"
    })
];