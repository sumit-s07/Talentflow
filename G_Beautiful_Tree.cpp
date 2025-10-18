#include<bits/stdc++.h>
using ll = long long;
const ll mod = 1e9+7;
using namespace std;

bool perfect_square(long long n){
    if(n<0){
        return false;
    }
    if(n==0){
        return true;
    }
    long long root = round(sqrtl(n));
    return root*root == n;
}

void solve(){
    int n;
    cin>>n;
    long long ts = (long long)n*(n+1)/2;

    for(int i = 1;i<=n;i++){
        long long sp = (long long)i *(ts-i);
        if(perfect_square(sp)){
            for(int j = 1;j<=n;j++){
                if(j!=i){
                    cout<<j<<" "<<i<<"\n";
                }
            }
            return;
        }
    }

    if(n>3){
        vector<int> p(n);
        int lval = 1, rval = n;
        for(int i = 0; i<n; i++){
            if(i%2 == 0){
                p[i] = lval++;
            }
            else{
                p[i] = rval--;
            }
        }

        long long sz = 0;
        for(int i = 0; i<n-1; i++){
            sz += (long long)p[i] *p[i+1];
        }
        if(perfect_square(sz)){
            for(int i = 0;i<n-1; i++){
                cout<<p[i]<<" "<<p[i+1]<<"\n";
            }
            return;
        }
    }
    cout<<-1<<"\n";
}

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    cin>>t;
    while(t--){
        solve();
    }

    return 0;
}