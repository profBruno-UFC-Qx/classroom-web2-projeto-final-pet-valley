<template>
    <Sidebar />

    <main class="page-content">
        <div class="dashboard-wrapper">
            <!-- Cabeçalho -->
            <div class="dashboard-header">
                <h1>Dashboard</h1>
            </div>

            <!-- Estatísticas Gerais -->
            <section class="stats-section">
                <h2 class="section-title">Estatísticas Gerais</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📋</div>
                        <div class="stat-content">
                            <p class="stat-label">Adoções Realizadas</p>
                            <p class="stat-value">0</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🏠</div>
                        <div class="stat-content">
                            <p class="stat-label">Animais Disponíveis</p>
                            <p class="stat-value">0</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-content">
                            <p class="stat-label">Usuários Cadastrados</p>
                            <p class="stat-value">0</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🏢</div>
                        <div class="stat-content">
                            <p class="stat-label">Organizações</p>
                            <p class="stat-value">0</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Seção Adoções -->
            <section class="dashboard-section">
                <h2 class="section-title">Adoções</h2>
                <div class="content-grid">
                    <div class="info-card">
                        <h3>Por Status</h3>
                        <div class="info-item">
                            <span>Ativas</span>
                            <span class="value">0</span>
                        </div>
                        <div class="info-item">
                            <span>Concluídas</span>
                            <span class="value">0</span>
                        </div>
                        <div class="info-item">
                            <span>Canceladas</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Por Tipo de Animal</h3>
                        <div class="info-item">
                            <span>Cães</span>
                            <span class="value">0</span>
                        </div>
                        <div class="info-item">
                            <span>Gatos</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Por Localização</h3>
                        <div class="info-item">
                            <span>Cidade</span>
                            <span class="value">-</span>
                        </div>
                        <div class="info-item">
                            <span>Estado</span>
                            <span class="value">-</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Tempo Médio</h3>
                        <div class="info-item">
                            <span>Dias para Adoção</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Seção Animais -->
            <section class="dashboard-section">
                <h2 class="section-title">Animais</h2>
                <div class="content-grid">
                    <div class="info-card">
                        <h3>Disponíveis por Tipo</h3>
                        <div class="info-item">
                            <span>Cães</span>
                            <span class="value">0</span>
                        </div>
                        <div class="info-item">
                            <span>Gatos</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Adotados por Tipo</h3>
                        <div class="info-item">
                            <span>Cães</span>
                            <span class="value">0</span>
                        </div>
                        <div class="info-item">
                            <span>Gatos</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Necessidades Especiais</h3>
                        <div class="info-item">
                            <span>Total</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Seção Usuários -->
            <section class="dashboard-section">
                <h2 class="section-title">Usuários</h2>
                <div class="content-grid">
                    <div class="info-card">
                        <h3>Por Tipo</h3>
                        <div class="info-item">
                            <span>Adotantes</span>
                            <span class="value">0</span>
                        </div>
                        <div class="info-item">
                            <span>Organizações</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Status</h3>
                        <div class="info-item">
                            <span>Ativos</span>
                            <span class="value">0</span>
                        </div>
                        <div class="info-item">
                            <span>Inativos</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Por Localização</h3>
                        <div class="info-item">
                            <span>Cidade</span>
                            <span class="value">-</span>
                        </div>
                        <div class="info-item">
                            <span>Estado</span>
                            <span class="value">-</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Seção Organizações -->
            <section class="dashboard-section">
                <h2 class="section-title">Organizações</h2>
                <div class="content-grid">
                    <div class="info-card">
                        <h3>Por Tipo</h3>
                        <div class="info-item">
                            <span>ONG</span>
                            <span class="value">0</span>
                        </div>
                        <div class="info-item">
                            <span>Protetor Independente</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Status</h3>
                        <div class="info-item">
                            <span>Ativas</span>
                            <span class="value">0</span>
                        </div>
                        <div class="info-item">
                            <span>Inativas</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <h3>Por Localização</h3>
                        <div class="info-item">
                            <span>Cidade</span>
                            <span class="value">-</span>
                        </div>
                        <div class="info-item">
                            <span>Estado</span>
                            <span class="value">-</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.page-content {
    background-color: var(--support);
    margin-left: 260px;
    padding: 2rem;
    min-height: 100vh;
}

.dashboard-wrapper {
    max-width: 1400px;
    margin: 0 auto;
}

.dashboard-header {
    margin-bottom: 2rem;
}

.dashboard-header h1 {
    color: var(--accent);
    font-size: 2rem;
    margin: 0;
}

/* Estatísticas Gerais */
.stats-section {
    margin-bottom: 2rem;
}

.section-title {
    color: var(--accent);
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
    font-weight: 600;
    border-bottom: 2px solid var(--primary);
    padding-bottom: 0.5rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 1rem;
    border-left: 4px solid var(--primary);
}

.stat-icon {
    font-size: 2rem;
}

.stat-content {
    flex: 1;
}

.stat-label {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
}

.stat-value {
    color: var(--accent);
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0.25rem 0 0 0;
}

/* Seções de Dashboard */
.dashboard-section {
    margin-bottom: 2rem;
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.info-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-card h3 {
    color: var(--primary);
    font-size: 1rem;
    margin: 0 0 1rem 0;
    font-weight: 600;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.95rem;
}

.info-item:last-child {
    border-bottom: none;
}

.info-item span:first-child {
    color: #666;
    font-weight: 500;
}

.info-item .value {
    color: var(--accent);
    font-weight: 600;
    font-size: 1.1rem;
}

/* Responsividade */
@media (max-width: 1024px) {
    .page-content {
        margin-left: 0;
        padding: 1.5rem;
    }

    .dashboard-header h1 {
        font-size: 1.5rem;
    }
}

@media (max-width: 768px) {
    .page-content {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .content-grid {
        grid-template-columns: 1fr;
    }

    .stat-card {
        flex-direction: column;
        text-align: center;
    }

    .dashboard-header h1 {
        font-size: 1.3rem;
    }
}
</style>
