<template>
    <div class="about-container p-6 max-w-3xl mx-auto h-full">
        <div class="flex items-center gap-4 mb-6">
            <h1 class="text-3xl font-bold text-yellow-400">Palworld Interactive Map</h1>
        </div>

        <div class="about-card p-6 rounded-lg shadow-lg bg-gray-800 text-gray-100 space-y-4">
            <p>
                <strong>Palworld Interactive Map</strong> is a tool designed to help players track
                their progress in open-world games. It offers a unique ability to display in-game
                objects in real-time by reading the game's memory to display the treasure chests and
                pal eggs near the player tile.
            </p>

            <p><strong>Version:</strong> v1.0.0</p>

            <p><strong>Developer:</strong> ARX II-13</p>

            <p>
                <strong>Source:</strong>
                <a
                    href="https://github.com/your-github-username/palworld-interactive-map"
                    target="_blank"
                    class="text-yellow-400 hover:underline"
                >
                    GitHub
                </a>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.about-container {
    background-color: #1f2937;
    color: #f3f4f6;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
a {
    transition: color 0.2s ease;
}
a:hover {
    color: #facc15;
}
</style>
