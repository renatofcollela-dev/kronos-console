import { useEffect, useMemo, useState } from 'react'
import {
  AppBar, Toolbar, Typography, Box, Container, Tabs, Tab, Grid, Card, CardContent,
  LinearProgress, Chip, Stack, CircularProgress, Alert, Avatar, Divider
} from '@mui/material'
import HubIcon from '@mui/icons-material/Hub'
import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'

const API = 'https://qxfyduqmuemdttrijukg.supabase.co/functions/v1/catalogo?k=kcat-9x7q&data=1'
const SECTIONS = ['Visão geral', 'Projetos', 'Regras', 'Agentes & Skills', 'Aprovados', 'Catálogo']

function pctColor(p) { if (p == null) return 'inherit'; if (p >= 80) return 'success.main'; if (p >= 40) return 'warning.main'; return 'error.main' }

function Kpi({ label, value, sub }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: .5 }}>{value}</Typography>
        {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
      </CardContent>
    </Card>
  )
}

function Overview({ nodes }) {
  const stats = useMemo(() => {
    const macro = nodes.filter(n => n.nivel === 1)
    const withPct = nodes.filter(n => n.percentual != null)
    const done = withPct.filter(n => n.percentual >= 100).length
    const avg = withPct.length ? Math.round(withPct.reduce((a, n) => a + n.percentual, 0) / withPct.length) : 0
    const layers = macro.map(m => {
      const kids = nodes.filter(n => n.camada === m.camada && n.percentual != null && n.nivel > 1)
      const la = kids.length ? Math.round(kids.reduce((a, n) => a + n.percentual, 0) / kids.length) : null
      const count = nodes.filter(n => n.camada === m.camada && n.nivel > 1).length
      return { nome: m.item, camada: m.camada, pct: la, count }
    })
    return { total: nodes.length, nMacro: macro.length, done, withPct: withPct.length, avg, layers }
  }, [nodes])

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={6} md={3}><Kpi label="Itens no sistema" value={stats.total} sub={stats.nMacro + ' camadas macro'} /></Grid>
        <Grid item xs={6} md={3}><Kpi label="Progresso médio" value={stats.avg + '%'} sub={stats.withPct + ' itens medidos'} /></Grid>
        <Grid item xs={6} md={3}><Kpi label="Itens 100%" value={stats.done} sub="concluídos" /></Grid>
        <Grid item xs={6} md={3}><Kpi label="Em medição" value={stats.withPct} sub="com percentual" /></Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Camadas do sistema</Typography>
      <Stack spacing={1.2}>
        {stats.layers.map((l) => (
          <Card key={l.camada}>
            <CardContent sx={{ py: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontWeight: 600 }}>{l.nome}</Typography>
                  <Typography variant="caption" color="text.secondary">{l.count} itens</Typography>
                </Box>
                <Box sx={{ width: { xs: 90, md: 240 } }}>
                  <LinearProgress variant="determinate" value={l.pct ?? 0}
                    sx={{ height: 8, borderRadius: 5, '& .MuiLinearProgress-bar': { bgcolor: pctColor(l.pct) } }} />
                </Box>
                <Typography variant="body2" sx={{ width: 44, textAlign: 'right', color: pctColor(l.pct), fontWeight: 600 }}>
                  {l.pct == null ? '—' : l.pct + '%'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}

function Soon({ name }) {
  return <Alert severity="info" sx={{ mt: 2 }}>{name}: próxima etapa — vou ligar esta seção ao banco em seguida.</Alert>
}

export default function App() {
  const [tab, setTab] = useState(0)
  const [nodes, setNodes] = useState(null)
  const [err, setErr] = useState(null)

  const load = () => {
    setNodes(null); setErr(null)
    fetch(API).then(r => r.json()).then(setNodes).catch(e => setErr(String(e)))
  }
  useEffect(load, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #e0e3e7' }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 1.5 }}><HubIcon fontSize="small" /></Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>KRONOS · Sistema</Typography>
          <IconButton onClick={load} size="small"><RefreshIcon /></IconButton>
        </Toolbar>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ px: 1 }}>
          {SECTIONS.map((s, i) => <Tab key={i} label={s} />)}
        </Tabs>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        {err && <Alert severity="error" sx={{ mb: 2 }}>Falha ao ler o banco: {err}</Alert>}
        {!nodes && !err && <Stack alignItems="center" sx={{ py: 8 }}><CircularProgress /></Stack>}
        {nodes && (
          <>
            {tab === 0 && <Overview nodes={nodes} />}
            {tab === 1 && <Soon name="Projetos (% e estado)" />}
            {tab === 2 && <Soon name="Regras" />}
            {tab === 3 && <Soon name="Agentes & Skills" />}
            {tab === 4 && <Soon name="Aprovados / Validados" />}
            {tab === 5 && <Soon name="Catálogo hierárquico" />}
          </>
        )}
        <Divider sx={{ mt: 4 }} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          lido ao vivo do banco · vw_catalogo_sistema · Material Design (Google) / MUI
        </Typography>
      </Container>
    </Box>
  )
}
