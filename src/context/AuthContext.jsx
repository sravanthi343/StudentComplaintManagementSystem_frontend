import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('cms_token')
    const savedUser  = localStorage.getItem('cms_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (authData) => {
    setToken(authData.token)
    const userData = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      rollNumber: authData.rollNumber,
      department: authData.department,
      phone: authData.phone,
      profilePicture: authData.profilePicture,
    }
    setUser(userData)
    localStorage.setItem('cms_token', authData.token)
    localStorage.setItem('cms_user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('cms_token')
    localStorage.removeItem('cms_user')
  }

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('cms_user', JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
