import { FormEvent, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Shield, Sparkles, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../services/api';

interface Props {
  mode: 'login' | 'register';
}

export function AuthPage({ mode }: Props) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: mode === 'login' ? 'admin@heroforce.com' : '',
    password: mode === 'login' ? 'Admin@123' : '',
    character: '',
  });

  const isRegister = mode === 'register';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) await register(form);
      else await login(form.email, form.password);
      navigate('/');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="brand brand--light">
          <span className="brand__mark">
            <Shield size={22} />
          </span>
          <span>HeroForce</span>
        </div>
        <div className="auth-visual__content">
          <div className="eyebrow">
            <Sparkles size={15} /> Projetos que movem o extraordinário
          </div>
          <h1>Todo grande projeto começa com um herói.</h1>
          <p>
            Transforme metas ambiciosas em missões concluídas, com transparência e
            trabalho em equipe.
          </p>
          <div className="value-list">
            <span>Agilidade</span>
            <span>Encantamento</span>
            <span>Excelência</span>
          </div>
        </div>
        <div className="orb orb--one" />
        <div className="orb orb--two" />
      </section>

      <section className="auth-form-area">
        <div className="auth-form-wrap">
          <div className="brand brand--mobile">
            <span className="brand__mark">
              <Shield size={22} />
            </span>
            <span>HeroForce</span>
          </div>
          <div className="auth-heading">
            <div className="mini-icon">
              <Zap size={19} />
            </div>
            <h2>{isRegister ? 'Crie sua identidade heroica' : 'Bem-vindo de volta'}</h2>
            <p>
              {isRegister
                ? 'Escolha seu personagem e entre para a força.'
                : 'Acesse o comando das suas missões.'}
            </p>
          </div>

          <form onSubmit={submit} className="auth-form">
            {isRegister && (
              <div className="field-row">
                <label>
                  Nome
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Seu nome"
                    minLength={2}
                    required
                  />
                </label>
                <label>
                  Personagem
                  <input
                    value={form.character}
                    onChange={(event) =>
                      setForm({ ...form, character: event.target.value })
                    }
                    placeholder="Ex.: Homem-Aranha"
                    minLength={2}
                    required
                  />
                </label>
              </div>
            )}
            <label>
              E-mail
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="voce@email.com"
                required
              />
            </label>
            <label>
              Senha
              <span className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Mínimo de 8 caracteres"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Exibir senha"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && <div className="form-error">{error}</div>}

            <button className="button button--primary button--wide" disabled={loading}>
              {loading
                ? 'Aguarde...'
                : isRegister
                  ? 'Criar minha conta'
                  : 'Entrar no comando'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? 'Já faz parte da equipe?' : 'Ainda não é um herói?'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Fazer login' : 'Criar conta'}
            </Link>
          </p>
          {!isRegister && (
            <p className="demo-hint">Acesso demo: admin@heroforce.com / Admin@123</p>
          )}
        </div>
      </section>
    </main>
  );
}
